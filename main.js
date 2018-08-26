(function(){
console.log("working");   
    var csGT = "A-";
    var dmGT = "B+";
    var phlGT = "A+";
    var engGT = "B";

    var csG = 3.677;
    var dmG = 3.332;
    var phlG = 4.332;
    var engG = 3.000;

    var csH = 4.000;
    var dmH = 3.000;
    var engH = 3.000;
    var phlH = 3.000;
// path to final grade letters
    var csFGpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(7)";
    var engFGpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(7)";
    var dmFGpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(5) > td:nth-child(7)";
    var phlFGpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(6) > td:nth-child(7)";
// phl fix up
    var phlearnedPath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(6) > td:nth-child(8)";
    var phlGHpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(6) > td:nth-child(10) > p";
// quality pts
    var csQPpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(12) > p";
    var engQPpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(12) > p";
    var dmQPpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(5) > td:nth-child(12) > p";
    var phlQPpath = "body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(6) > td:nth-child(12) > p";
// conclusion avg path
    var currentEarnedPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(3) > p";
    var currentQualityPtsPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(5) > p";
    var currentGpaPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(6) > p";

    var cumulativeEarnedPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(3) > p";
    var cumulativeQualityPtsPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(5) > p";
    var cumulativeGpaPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(6) > p";
    var cumulativeGpaHoursPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(4) > p";

    var overallEarnedPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(5) > td:nth-child(3) > p";
    var overallQualityPtsPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(5) > td:nth-child(5) > p";
    var overallGpaPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(5) > td:nth-child(6) > p";
    var overallGpaHoursPath = "body > div.pagebodydiv > table:nth-child(6) > tbody > tr:nth-child(5) > td:nth-child(4) > p";
        var tltH = csH+dmH+engH+phlH;
var tltQP = (csG*csH)+(engG*engH)+(dmG*dmH)+(phlG*phlH);
    var firstTermQP = 61.38;
var firstTermHours = 17.000;
    var transferQP = 97.000;
var transferHours = 32.000;
    var testExists = document.querySelector("body > div.pagebodydiv > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(1)");
    if(testExists) {
        if(testExists.innerHTML == "18381") {
    document.querySelector(csFGpath).innerHTML = csGT;
    document.querySelector(engFGpath).innerHTML = engGT;
    document.querySelector(dmFGpath).innerHTML = dmGT;
    document.querySelector(phlFGpath).innerHTML = phlGT;
            // earned hours and text remover
            document.querySelector(phlearnedPath).innerHTML = "";
            document.querySelector(phlGHpath).innerHTML = parseFloat(phlH).toFixed(3);

            document.querySelector(csQPpath).innerHTML = parseFloat(csG*csH).toFixed(3);
            document.querySelector(engQPpath).innerHTML = parseFloat(engG*engH).toFixed(3);
            document.querySelector(dmQPpath).innerHTML = parseFloat(dmG*dmH).toFixed(3);
            document.querySelector(phlQPpath).innerHTML = parseFloat(phlG*phlH).toFixed(3);
    document.querySelector(currentEarnedPath).innerHTML = parseFloat(tltH).toFixed(3);
    document.querySelector(currentQualityPtsPath).innerHTML = parseFloat(tltQP).toFixed(3);
    document.querySelector(currentGpaPath).innerHTML = parseFloat(tltQP/tltH).toFixed(3);

        document.querySelector(cumulativeEarnedPath).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(cumulativeGpaHoursPath).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(cumulativeQualityPtsPath).innerHTML = parseFloat(tltQP+firstTermQP).toFixed(3);
    document.querySelector(cumulativeGpaPath).innerHTML = parseFloat((tltQP+firstTermQP)/(tltH+firstTermHours)).toFixed(3);

    document.querySelector(overallEarnedPath).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
    document.querySelector(overallGpaHoursPath).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
    document.querySelector(overallQualityPtsPath).innerHTML = parseFloat(tltQP+firstTermQP+transferQP).toFixed(3);
    document.querySelector(overallGpaPath).innerHTML = parseFloat((tltQP+firstTermQP+transferQP)/(tltH+firstTermHours+transferHours)).toFixed(3);

    } else {

    document.querySelector(cumulativeEarnedPath).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(cumulativeGpaHoursPath).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(cumulativeQualityPtsPath).innerHTML = parseFloat(tltQP+firstTermQP).toFixed(3);
    document.querySelector(cumulativeGpaPath).innerHTML = parseFloat((tltQP+firstTermQP)/(tltH+firstTermHours)).toFixed(3);

    document.querySelector(overallEarnedPath).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
    document.querySelector(overallGpaHoursPath).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
    document.querySelector(overallQualityPtsPath).innerHTML = parseFloat(tltQP+firstTermQP+transferQP).toFixed(3);
    document.querySelector(overallGpaPath).innerHTML = parseFloat((tltQP+firstTermQP+transferQP)/(tltH+firstTermHours+transferHours)).toFixed(3);

    }
    }
    var unofficalTest = document.querySelector("body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(9) > td");
    if(unofficalTest != null) {
    if(unofficalTest.innerHTML == "***This is NOT an Official Transcript***"){
        var _csGPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(75) > td:nth-child(5)";
        var _engGPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(76) > td:nth-child(5)";
        var _dmGPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(77) > td:nth-child(5)";
        var _phlGPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(78) > td:nth-child(5)";
        var _csQPPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(75) > td:nth-child(7)";
        var _engQPPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(76) > td:nth-child(7)";
        var _dmQPPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(77) > td:nth-child(7)";
        var _phlQPPath = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(78) > td:nth-child(7)";

        var _currentPassedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(81) > td:nth-child(3)";
        var _currentEarnedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(81) > td:nth-child(4)";
        var _currentGPAHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(81) > td:nth-child(5)";
        var _currentQP = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(81) > td:nth-child(6)";
        var _currentGPA = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(81) > td:nth-child(7)";

        var _cumulativePassedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(82) > td:nth-child(3)";
        var _cumulativeEarnedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(82) > td:nth-child(4)";
        var _cumulativeGPAHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(82) > td:nth-child(5)";
        var _cumulativeQP = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(82) > td:nth-child(6)";
        var _cumulativeGPA = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(82) > td:nth-child(7)";
        document.querySelector(_csGPath).innerHTML = csGT;
        document.querySelector(_dmGPath).innerHTML = dmGT;
        document.querySelector(_engGPath).innerHTML = engGT;
        document.querySelector(_phlGPath).innerHTML = phlGT;


        
        document.querySelector(_csQPPath).innerHTML = parseFloat(csG*csH).toFixed(3);
            document.querySelector(_engQPPath).innerHTML = parseFloat(engG*engH).toFixed(3);
            document.querySelector(_dmQPPath).innerHTML = parseFloat(dmG*dmH).toFixed(3);
            document.querySelector(_phlQPPath).innerHTML = parseFloat(phlG*phlH).toFixed(3);

    document.querySelector(_currentPassedHours).innerHTML = parseFloat(tltH).toFixed(3);
    document.querySelector(_currentEarnedHours).innerHTML = parseFloat(tltH).toFixed(3);
    document.querySelector(_currentGPAHours).innerHTML = parseFloat(tltH).toFixed(3);
    document.querySelector(_currentQP).innerHTML = parseFloat(tltQP).toFixed(3);
    document.querySelector(_currentGPA).innerHTML = parseFloat(tltQP/tltH).toFixed(3);

    document.querySelector(_cumulativePassedHours).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(_cumulativeEarnedHours).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(_cumulativeGPAHours).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(_cumulativeQP).innerHTML = parseFloat(tltQP+firstTermQP).toFixed(3);
    document.querySelector(_cumulativeGPA).innerHTML = parseFloat((tltQP+firstTermQP)/(tltH+firstTermHours)).toFixed(3);

    var schoolPassedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(87) > td:nth-child(3)";
    var schoolEarnedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(87) > td:nth-child(4)";
    var schoolGPAHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(87) > td:nth-child(5)";
    var schoolQP = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(87) > td:nth-child(6)";
    var schoolGPA = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(87) > td:nth-child(7)";

    var overallPassedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(89) > td:nth-child(3)";
    var overallEarnedHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(89) > td:nth-child(4)";
    var overallGPAHours = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(89) > td:nth-child(5)";
    var overallQP = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(89) > td:nth-child(6)";
    var overallGPA = "body > div.pagebodydiv > table.datadisplaytable > tbody > tr:nth-child(89) > td:nth-child(7)";

    document.querySelector(schoolPassedHours).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(schoolEarnedHours).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(schoolGPAHours).innerHTML = parseFloat(tltH+firstTermHours).toFixed(3);
    document.querySelector(schoolQP).innerHTML = parseFloat(tltQP+firstTermQP).toFixed(3);
    document.querySelector(schoolGPA).innerHTML = parseFloat((tltQP+firstTermQP)/(tltH+firstTermHours)).toFixed(3);

      document.querySelector(overallPassedHours).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
    document.querySelector(overallEarnedHours).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
        document.querySelector(overallGPAHours).innerHTML = parseFloat(tltH+firstTermHours+transferHours).toFixed(3);
    document.querySelector(overallQP).innerHTML = parseFloat(tltQP+firstTermQP+transferQP).toFixed(3);
    document.querySelector(overallGPA).innerHTML = parseFloat((tltQP+firstTermQP+transferQP)/(tltH+firstTermHours+transferHours)).toFixed(3);

    }
    }
    if(window.location.hostname == "degreeworks.ua.edu") {
        alert("DegreeWorks is currently undergoing maintenance. Please try again at a later date.");
        window.close();
    }

/*


var gradeList = document.getElementsByClassName("datadisplaytable");
for (var i = 0; i < 3; i++) {
if(i==0) {

}
}
*/
   })();
