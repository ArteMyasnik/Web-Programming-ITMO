package com.artemyasnik.server;

import com.fastcgi.FCGIInterface;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class Server {
    private static final Map<String, List<ResultData>> userSessions = new ConcurrentHashMap<>();

    public static void main(String[] args) {
        FCGIInterface fcgi = new FCGIInterface();

        while (fcgi.FCGIaccept() >= 0) {
            try {
                if (FCGIInterface.request == null) {
                    System.err.println("FCGI: request is null");
                    continue;
                }

                long startTime = System.nanoTime();
                String method = prop("REQUEST_METHOD", "");

                if (!"POST".equals(method)) {
                    sendErrorResponse(405, "Only POST method is supported");
                    continue;
                }

                int contentLength = parseLengthSafe(prop("CONTENT_LENGTH", "0"), 0);
                if (contentLength <= 0) {
                    sendErrorResponse(400, "Empty body request");
                    continue;
                }

                String body = readBody(contentLength);
                Map<String, String> params = parseJson(body);

                String sessionId = getSessionId(params);

                // Загрузка историю, если впервые запрашивается
                String action = params.get("action");
                if (action != null && "get_history".equalsIgnoreCase(action)) {
                    sendSessionHistory(sessionId);
                    continue;
                }

                // Получаем параметры
                if (!params.containsKey("x") || !params.containsKey("y") || !params.containsKey("r")) {
                    sendErrorResponse(400, "Missing parameters: x, y, r");
                    continue;
                }

                // Получаем значения из JSON
                String xStr = params.get("x");
                String yStr = params.get("y");
                String rStr = params.get("r");

                // Валидация данные
                ValidationResult validationResult = validateParameters(xStr, yStr, rStr);
                if (!validationResult.isValid()) {
                    sendErrorResponse(400, validationResult.error());
                    continue;
                }

                // Парсинг значений
                double x = Double.parseDouble(xStr.replace(',', '.'));
                double y = Double.parseDouble(yStr.replace(',', '.'));
                double r = Double.parseDouble(rStr.replace(',', '.'));

                // Проверяем попадание
                boolean hit = checkHit(x, y, r);
                // Записываем время работы в микросекундах
                long workTime = (System.nanoTime() - startTime) / 1000;

                // Создаем объект результата и сохраняем его в сессии
                ResultData resultData = new ResultData(x, y, r, hit,
                        DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss").format(LocalDateTime.now()),
                        workTime);
                addToSession(sessionId, resultData);

                // Отправляем ответ
                sendResult(x, y, r, hit, workTime, sessionId);

            } catch (Exception e) {
                sendErrorResponse(500, "Internal server error");
            }
        }
    }

    private static void sendSessionHistory(String sessionId) {
        List<ResultData> sessionResults = getSessionResults(sessionId);
        StringBuilder jsonResultsBuilder = new StringBuilder();
        jsonResultsBuilder.append("{\"session_id\":\"").append(sessionId).append("\",\"history\":[");
        for (int i = 0; i < sessionResults.size(); i++) {
            ResultData result = sessionResults.get(i);
            if (i > 0) jsonResultsBuilder.append(",");
            jsonResultsBuilder.append(String.format(Locale.US,
                    "{\"x\":%.1f,\"y\":%.1f,\"r\":%.1f,\"hit\":%s,\"current_time\":\"%s\",\"execution_time\":%d}",
                    result.x(), result.y(), result.r(), result.hit(),
                    result.currentTime(), result.executionTime()));
        }
        jsonResultsBuilder.append("]}");
        sendResponse(200, jsonResultsBuilder.toString());
    }

    private static String generateSessionId() {
        return UUID.randomUUID().toString();
    }

    private static String getSessionId(Map<String, String> params) {
        String sessionId = params.get("session_id");
        if (sessionId == null || sessionId.trim().isEmpty()) {
            return generateSessionId();
        }
        return sessionId;
    }

    private static void addToSession(String sessionId, ResultData result) {
        userSessions.compute(sessionId, (key, results) -> {
            if (results == null) {
                results = new ArrayList<>();
            }
            results.add(0, result);
            if (results.size() > 50) {
                results = results.subList(0, 50);
            }
            return results;
        });
    }

    private static List<ResultData> getSessionResults(String sessionId) {
        return userSessions.getOrDefault(sessionId, new ArrayList<>());
    }

    private static void sendErrorResponse(int status, String errorMessage) {
        String json = String.format("{\"error\":\"%s\"}", errorMessage);
        sendResponse(status, json);
    }

    private static Map<String, String> parseJson(String json) {
        Map<String, String> result = new HashMap<>();
        try {
            if (json == null || json.isBlank()) return result;
            String trimmedJson = json.trim();

            if (!trimmedJson.matches("^\\s*\\{.*\\}\\s*$")) {
                System.err.println("Invalid json: must be enclosed in {}");
                return result;
            }

            String content = trimmedJson.substring(1, trimmedJson.length() - 1).trim();
            if (content.isEmpty()) { return result; }

            String[] pairs = content.split(",");
            for (String pair : pairs) {
                String[] keyValue = pair.split(":", 2);
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim().replace("\"", "");
                    String value = keyValue[1].trim().replace("\"", "");

                    if (!key.isEmpty() && !value.isEmpty()) { result.put(key, value); }
                }
            }
        } catch (Exception e) { System.err.println("JSON parsing error: " + e.getMessage()); }

        return result;
    }

    private static String readBody(int length) throws IOException {
        InputStream in = FCGIInterface.request.inStream;
        ByteArrayOutputStream out = new ByteArrayOutputStream(Math.max(length, 64));
        byte[] buffer = new byte[4096];
        int remaining = length;
        while (remaining > 0) {
            int num = in.read(buffer, 0, Math.min(remaining, buffer.length));
            if (num < 0) break;
            out.write(buffer, 0, num);
            remaining -= num;
        }

        return out.toString(StandardCharsets.UTF_8);
    }

    private static ValidationResult validateParameters(String xStr, String yStr, String rStr) {
        try {
            double x = Double.parseDouble(xStr);
            double[] validXValues = {-5, -4, -3, -2, -1, 0, 1, 2, 3};
            boolean isValidXValue = Arrays.stream(validXValues).anyMatch(valid -> Math.abs(valid - x) < 0.01);
            if (!isValidXValue) {
                return new ValidationResult(false, "X value must be an Integer in range from -5 to 3");
            }
        } catch (NumberFormatException e) {
            return new ValidationResult(false, "X must be a Number");
        }

        try {
            double y = Double.parseDouble(yStr.trim().replace(',', '.'));
            boolean isValidYValue = y >= -3 && y <= 3 && y == Math.floor(y);
            if (!isValidYValue) {
                return new ValidationResult(false, "Y value must be an Integer in range from -3 to 3");
            }
        } catch (NumberFormatException e) {
            return new ValidationResult(false, "Y must be a Number");
        }

        try {
            double r = Double.parseDouble(rStr.trim().replace(',', '.'));
            double[] validRValues = {1, 2, 3, 4};
            boolean isValidRValue = Arrays.stream(validRValues).anyMatch(valid -> Math.abs(valid - r) < 0.01);
            if (!isValidRValue) {
                return new ValidationResult(false, "R value must be an Integer in range from 1 to 4");
            }
        } catch (NumberFormatException e) {
            return new ValidationResult(false, "R must be a Number");
        }

        return new ValidationResult(true, "");
    }

    private static int parseLengthSafe(String stringLength, int defaultValue) {
        try {
            return Integer.parseInt(stringLength.trim());
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private static String prop(String propertyKey, String defaultValue) {
        String property = FCGIInterface.request.params.getProperty(propertyKey);
        return property != null ? property : defaultValue;
    }

    private static boolean checkHit(double x, double y, double r) {
        boolean triangle = (x >= 0) && (y >= 0) && (y <= -x + r/2);
        boolean rectangle = (x >= 0) && (x <= r) && (y <= 0) && (y >= -r/2);
        boolean circle = (x <= 0) && (y <= 0) && (x*x + y*y <= r*r);
        return triangle || rectangle || circle;
    }

    private static void sendResult(double x, double y, double r, boolean hit, long workTime, String sessionId) {
        String json = String.format(Locale.US,
                "{\"x\":%.1f,\"y\":%.1f,\"r\":%.1f,\"hit\":%s,\"current_time\":\"%s\",\"execution_time\":%d,\"session_id\":\"%s\"}",
                x, y, r, hit,
                DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss").format(LocalDateTime.now()),
                workTime, sessionId);
        sendResponse(200, json);
    }

    private static void sendResponse(int status, String json) {
        try {
            byte[] body = json.getBytes(StandardCharsets.UTF_8);
            System.out.print("Status: " + getStatusText(status) + "\r\n");
            System.out.print("Content-Type: application/json; charset=UTF-8\r\n");
            System.out.print("Cache-Control: no-store\r\n");
            System.out.print("Content-Length: " + body.length + "\r\n");
            System.out.print("\r\n");
            System.out.write(body, 0, body.length);
            System.out.flush();
        } catch (Exception e) {
            System.err.println("Error sending response: " + e);
        }
    }

    private static String getStatusText(int status) {
        return switch (status) {
            case 200 -> "200 OK";
            case 400 -> "400 Bad Request";
            case 405 -> "405 Method Not Allowed";
            case 500 -> "500 Internal Server Error";
            default -> status + " OK";
        };
    }

    private record ValidationResult(boolean isValid, String error) {
    }

    private record ResultData(double x, double y, double r, boolean hit, String currentTime, long executionTime) {
    }
}
