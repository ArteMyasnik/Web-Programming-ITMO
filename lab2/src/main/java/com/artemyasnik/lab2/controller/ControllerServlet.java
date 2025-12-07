package com.artemyasnik.lab2.controller;

import com.artemyasnik.lab2.service.ResultService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {
    private final ResultService resultService = new ResultService();

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
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String r = request.getParameter("radius");

        // Если есть параметры - отправляем на проверку
        if (x != null && y != null && r != null) {
            request.getRequestDispatcher("/area-check").forward(request, response);
        } else {
            // Иначе показываем главную страницу с историей
            loadResultsToRequest(request);
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }

    private void loadResultsToRequest(HttpServletRequest request) {
        request.setAttribute("resultsHistory", resultService.getResults(getServletContext()));
    }
}