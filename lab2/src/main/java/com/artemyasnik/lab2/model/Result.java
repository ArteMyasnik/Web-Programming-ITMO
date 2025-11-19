package com.artemyasnik.lab2.model;

import java.io.Serializable;

public class Result implements Serializable {
    private final double x;
    private final double y;
    private final double r;
    private final boolean hit;
    private final String currentTime;
    private final long executionTime;

    public Result(double x, double y, double r, boolean hit, String currentTime, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.currentTime = currentTime;
        this.executionTime = executionTime;
    }

    // Getters
    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public String getCurrentTime() { return currentTime; }
    public long getExecutionTime() { return executionTime; }
}