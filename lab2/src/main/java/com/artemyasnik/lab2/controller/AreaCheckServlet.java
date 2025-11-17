package com.artemyasnik.lab2.controller;

import com.artemyasnik.lab2.model.Result;
import com.artemyasnik.lab2.service.ResultService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@WebServlet("/area-check")
public class AreaCheckServlet extends HttpServlet {
    private final ResultService resultService = new ResultService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        long startTime = System.nanoTime();

        try {
            // Получаем параметры
            double x = Double.parseDouble(request.getParameter("x"));
            double y = Double.parseDouble(request.getParameter("y"));
            double r = Double.parseDouble(request.getParameter("radius"));

            // Проверяем попадание в область
            boolean isHit = checkArea(x, y, r);

            // Время выполнения
            long endTime = System.nanoTime();
            long executionTime = (endTime - startTime) / 1000; // микросекунды

            // Текущее время
            String currentTime = LocalDateTime.now().format(
                    DateTimeFormatter.ofPattern("HH:mm:ss dd-MM-yyyy")
            );

            // Создаем объект результата
            Result result = new Result(x, y, r, isHit, currentTime, executionTime);

            // Сохраняем результат через сервис
            resultService.addResult(getServletContext(), result);

            // Загружаем историю результатов и устанавливаем атрибуты для JSP
            request.setAttribute("x", x);
            request.setAttribute("y", y);
            request.setAttribute("r", r);
            request.setAttribute("isHit", isHit);
            request.setAttribute("currentTime", currentTime);
            request.setAttribute("executionTime", executionTime);
            request.setAttribute("resultsHistory", resultService.getResults(getServletContext()));

            // Перенаправляем обратно на страницу с результатами
            request.getRequestDispatcher("/index.jsp").forward(request, response);

        } catch (NumberFormatException e) {
            // Обработка ошибок валидации
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid parameters");
        }
    }

    private boolean checkArea(double x, double y, double r) {
        // Проверка прямоугольника (левый верхний квадрант)
        if (x <= 0 && y >= 0 && x >= -r && y <= r) {
            return true;
        }

        // Проверка треугольника (правый нижний квадрант)
        if (x >= 0 && y <= 0 && y >= x - r/2) {
            return true;
        }

        // Проверка четверти круга (правый верхний квадрант)
        if (x >= 0 && y >= 0 && (x * x + y * y) <= r * r) {
            return true;
        }

        return false;
    }
}