package com.artemyasnik.lab2.controller;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class ControllerServlet extends HttpServlet {

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
        // Получаем параметры из запроса
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String r = request.getParameter("radius");

        // Валидация параметров
        if (x != null && y != null && r != null) {
            // Перенаправляем в AreaCheckServlet для проверки попадания в область
            request.getRequestDispatcher("/area-check").forward(request, response);
        } else {
            // Если параметры отсутствуют, показываем основную страницу
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}