<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="author" content="Myasnikov Artem"/>
    <meta name="description" content="Web-programming. Laboratory 2"/>
    <title>Main page lab2</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">
</head>
<body>
<div id="main-container">
    <div id="header-section">
        <h1 class="group-variant">Myasnikov Artem Valerievich</h1>
        <h2 class="group-variant">Group: P3223</h2>
        <h2 class="group-variant">Variant: 3001</h2>
    </div>

    <div id="content-section">
        <div id="aside-column">
            <form id="coordinates-form" action="controller" method="post">
                <div style="position: relative; width: 200px; height: 300px;">
                    <svg width="200px" height="300px" style="border: 1px solid #ccaa72;">
                        <!-- Треугольник -->
                        <polygon points="100,150 140,150 100,190" fill="#2f1f42" stroke="#5f398d" stroke-width="2"/>

                        <!-- Прямоугольник -->
                        <rect x="60" y="70" width="40" height="80" fill="#2f1f42" stroke="#5f398d" stroke-width="2"/>

                        <!-- Четверть круга -->
                        <path d="M100,150 L100,70 A80,80 0 0,1 180,150 L100,150 Z" fill="#2f1f42" stroke="#5f398d" stroke-width="2"></path>

                        <!-- Arrow OY -->
                        <line x1="100px" y1="20px" x2="100px" y2="280px" stroke-width="2" stroke="#ccaa72"/>
                        <line x1="100px" y1="20px" x2="105px" y2="25px" stroke-width="2" stroke="#ccaa72"/>
                        <line x1="100px" y1="20px" x2="95px" y2="25px" stroke-width="2" stroke="#ccaa72"/>
                        <text x="105px" y="25px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">Y</text>

                        <!-- Arrow OX -->
                        <line x1="10px" y1="150px" x2="195px" y2="150px" stroke-width="2" stroke="#ccaa72"/>
                        <line x1="190px" y1="145px" x2="195px" y2="150px" stroke-width="2" stroke="#ccaa72"/>
                        <line x1="190px" y1="155px" x2="195px" y2="150px" stroke-width="2" stroke="#ccaa72"/>
                        <text x="190px" y="140px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">X</text>

                        <!-- Radius -->
                        <text x="20px" y="147px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">-R</text>
                        <text x="60px" y="147px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">-R/2</text>
                        <text x="140px" y="147px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">R/2</text>
                        <text x="180px" y="147px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">R</text>

                        <text x="102px" y="70px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">R</text>
                        <text x="102px" y="110px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">R/2</text>
                        <text x="102px" y="190px" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">-R/2</text>
                        <text x="102px" y="230" font-family="Roboto Light monospace;" font-size="12" fill="#ccaa72">-R</text>
                    </svg>

                    <canvas id="area-canvas" width="200" height="300"
                            style="position: absolute; z-index: 2; cursor: pointer; background: transparent;"></canvas>
                </div>
                <br>

                <div class="form-table">
                    <!-- Coordinate X -->
                    <div class="form-row">
                        <div class="form-label">
                            <label for="coordinate-x">Coordinate X</label>
                        </div>
                        <div class="form-input">
                            <select id="coordinate-x" name="x" required>
                                <option value="" disabled selected>Select value</option>
                                <c:set var="xValues" value="${[-3, -2, -1, 0, 1, 2, 3, 4, 5]}" />
                                <c:forEach var="xVal" items="${xValues}">
                                    <option value="${xVal}">${xVal}</option>
                                </c:forEach>
                            </select>
                            <div id="error-x" class="error-message"></div>
                        </div>
                    </div>

                    <!-- Coordinate Y -->
                    <div class="form-row">
                        <div class="form-label">
                            <label for="coordinate-y">Coordinate Y</label>
                        </div>
                        <div class="form-input">
                            <input type="text" id="coordinate-y" name="y" placeholder="From -3 to 3" required>
                            <div class="range-hint">Range: -3 ... 3</div>
                            <div id="error-y" class="error-message"></div>
                        </div>
                    </div>

                    <!-- Radius -->
                    <div class="form-row">
                        <div class="form-label">
                            <label>Radius R</label>
                        </div>
                        <div class="form-input">
                            <div class="radio-group">
                                <c:set var="rValues" value="${[1, 1.5, 2, 2.5, 3]}" />
                                <c:forEach var="rVal" items="${rValues}" varStatus="status">
                                    <label class="radio-option">
                                        <input type="radio" name="radius" value="${rVal}" ${status.first ? 'required' : ''}>
                                        <span class="radio-label">${rVal}</span>
                                    </label>
                                </c:forEach>
                            </div>
                            <div class="range-hint">Range: 1 ... 3</div>
                            <div id="error-r" class="error-message"></div>
                        </div>
                    </div>

                    <!-- Submit button -->
                    <div class="form-row">
                        <div class="form-submit">
                            <button type="submit">SUBMIT</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <div id="main-column">
            <h2>Results</h2>
            <div id="results-container">
                <div class="results-header">
                    <div class="result-header-cell">Coordinate X</div>
                    <div class="result-header-cell">Coordinate Y</div>
                    <div class="result-header-cell">Radius R</div>
                    <div class="result-header-cell">Fact of entering the area</div>
                    <div class="result-header-cell">Current time</div>
                    <div class="result-header-cell">Script execution time</div>
                </div>
                <div class="results-body">
                    <!-- Results history from context -->
                    <c:if test="${not empty resultsHistory}">
                        <p>Количество элементов: ${fn:length(resultsHistory)}</p>
                        <c:forEach var="result" items="${resultsHistory}">
                            <div class="result-row">
                                <div class="result-cell">${result.x}</div>
                                <div class="result-cell">${result.y}</div>
                                <div class="result-cell">${result.r}</div>
                                <div class="result-cell">${result.hit ? 'Yes' : 'No'}</div>
                                <div class="result-cell">${result.currentTime}</div>
                                <div class="result-cell">${result.executionTime} µs</div>
                            </div>
                        </c:forEach>
                    </c:if>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href)
    }
</script>
<script src="${pageContext.request.contextPath}/resources/js/bundle.js"></script>
</body>
</html>