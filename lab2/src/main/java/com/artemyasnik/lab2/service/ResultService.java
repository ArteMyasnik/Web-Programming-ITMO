package com.artemyasnik.lab2.service;

import com.artemyasnik.lab2.model.Result;
import jakarta.servlet.ServletContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class ResultService {
    private static final String RESULTS_ATTRIBUTE = "results";

    @SuppressWarnings("unchecked")
    public List<Result> getResults(ServletContext context) {
        List<Result> results = (List<Result>) context.getAttribute(RESULTS_ATTRIBUTE);
        return results != null ? new ArrayList<>(results) : new ArrayList<>();
    }

    public void addResult(ServletContext context, Result result) {
        List<Result> results = getResults(context);
        results.add(0, result); // Добавляем в начало

        // Ограничиваем размер истории
        if (results.size() > 50) {
            results = new ArrayList<>(results.subList(0, 50));
        }

        context.setAttribute(RESULTS_ATTRIBUTE, Collections.unmodifiableList(results));
    }
}