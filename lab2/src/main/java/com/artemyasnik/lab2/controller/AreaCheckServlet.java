package com.artemyasnik.lab2.controller;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
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
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            );

            // Устанавливаем атрибуты для JSP
            request.setAttribute("x", x);
            request.setAttribute("y", y);
            request.setAttribute("r", r);
            request.setAttribute("isHit", isHit);
            request.setAttribute("currentTime", currentTime);
            request.setAttribute("executionTime", executionTime);

            // Перенаправляем обратно на страницу с результатами
            request.getRequestDispatcher("/index.jsp").forward(request, response);

        } catch (NumberFormatException e) {
            // Обработка ошибок валидации
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid parameters");
        }
    }

    private boolean checkArea(double x, double y, double r) {
        // Проверка прямоугольника (четверть)
        if (x <= 0 && y >= 0 && x >= r/2 && y <= r) {
            return true;
        }

        // Проверка треугольника
        if (x >= 0 && y <= 0 && y >= x - r/2) {
            return true;
        }

        // Проверка четверти круга
        if (x >= 0 && y >= 0 && (x * x + y * y) <= r * r) {
            return true;
        }

        else {
            return false;
        }
    }
}