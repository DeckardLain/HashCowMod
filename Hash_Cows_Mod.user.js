// ==UserScript==
// @name        Hash Cows Mod
// @namespace   http://thelle.ws/
// @description Mod for Hash Cows Stats Page
// @include     https://hashco.ws/stats.php
// @version     1
// ==/UserScript==


// ----------Recalculate Difficulty as number of Diff 1 shares----------
var elmOldDiff = document.getElementsByClassName("pull-right")[1];
var strOldDiff = elmOldDiff.textContent;
var strNewDiff = strOldDiff.substring(12,strOldDiff.length-1) * 65536 / 1000;
strNewDiff = strNewDiff.toFixed(0);
elmOldDiff.innerHTML = '<div class="pull-right">Difficulty: ' + strNewDiff + 'K</div>';

// ----------Calculate Pool Rejected %----------
// Add Heading
var elmCurrentRound = document.getElementsByClassName("table compress")[1];
var elmCurrentRoundHeading = elmCurrentRound.getElementsByTagName("th")[7];

var elmRejectPercentHeading = document.createElement("th");
elmRejectPercentHeading.appendChild(document.createTextNode("Reject %"));

elmCurrentRoundHeading.parentNode.insertBefore(elmRejectPercentHeading, elmCurrentRoundHeading.nextSibling);

// Calculate Reject %
var elmCurrentRoundStats = elmCurrentRound.getElementsByClassName("activeround")[0];
var elmCurrentRoundAccepted = elmCurrentRoundStats.getElementsByTagName("td")[6];
var elmCurrentRoundRejected = elmCurrentRoundStats.getElementsByTagName("td")[7];

strCurrentRoundAccepted = elmCurrentRoundAccepted.textContent
strCurrentRoundRejected = elmCurrentRoundRejected.textContent

strCurrentRoundAccepted = strCurrentRoundAccepted * 1
strCurrentRoundRejected = strCurrentRoundRejected * 1

var strCurrentRoundRejectPercent = strCurrentRoundRejected / (strCurrentRoundRejected + strCurrentRoundAccepted) * 100;
strCurrentRoundRejectPercent = strCurrentRoundRejectPercent.toFixed(2);
strCurrentRoundRejectPercent = strCurrentRoundRejectPercent + "%";

// Add % to table
var elmCurrentRoundRejectPercent = document.createElement("td");
elmCurrentRoundRejectPercent.appendChild(document.createTextNode(strCurrentRoundRejectPercent));
elmCurrentRoundRejected.parentNode.insertBefore(elmCurrentRoundRejectPercent, elmCurrentRoundRejected.nextSibling);

// ----------Calculate Reject Rate Delta----------
var elmUserStats = document.getElementsByClassName("table compress")[0];
var elmUserRejectRate = elmUserStats.getElementsByTagName("td")[3];

var strUserRejectRate = elmUserRejectRate.textContent;
strUserRejectRate = strUserRejectRate.substr(0,strUserRejectRate.length - 2);

strCurrentRoundRejectPercentVal = strCurrentRoundRejectPercent.substr(0, strCurrentRoundRejectPercent.length - 1);
var strUserRejectDelta = strUserRejectRate - strCurrentRoundRejectPercentVal;

// Format reject rate for display
strUserRejectRate = strUserRejectRate * 1;
var strUserRejectDisplay = strUserRejectRate.toFixed(2) + "%" + " (" + strUserRejectDelta.toFixed(2) + "%)";

var elmNewUserRejectRate = document.createElement("td");
elmNewUserRejectRate.appendChild(document.createTextNode(strUserRejectDisplay));

if (strUserRejectDelta < 0)
{
	elmNewUserRejectRate.style.backgroundColor = 'Chartreuse';
}
else
{
	elmNewUserRejectRate.style.backgroundColor = 'OrangeRed';
}

elmUserRejectRate.parentNode.replaceChild(elmNewUserRejectRate, elmUserRejectRate);

// ----------Calculate Round Profitability----------
var elmRoundStats = document.getElementsByClassName("table compress")[2];

// Add heading
var elmRoundStatsHeading = elmRoundStats.getElementsByTagName("th")[9];

var elmRoundStatsNewHeading = document.createElement("th");
elmRoundStatsNewHeading.appendChild(document.createTextNode("Round Profitability"));
elmRoundStatsHeading.parentNode.insertBefore(elmRoundStatsNewHeading, elmRoundStatsHeading.nextSibling);

// Go through each row in the round stats
var elmRoundStatsRows = elmRoundStats.getElementsByTagName("tr");

for (var i = elmRoundStatsRows.length - 1; i >= 0; i--)
//for (var i = elmRoundStatsRows.length - 1; i >= elmRoundStatsRows.length - 1; i--)
{
	var elmRow = elmRoundStatsRows[i];
	var elmLength = elmRow.getElementsByTagName("td")[2];
	var elmEarnings = elmRow.getElementsByTagName("td")[9];
	
	// First convert length to hours
	var strLength = elmLength.textContent;
	var strHours = strLength.substr(0, 2);
	var strMinutes = strLength.substr(3, 2);
	var strSeconds = strLength.substr(6, 2);
	
	strHours = strHours * 1;
	strMinutes = strMinutes * 1;
	strSeconds = strSeconds * 1;
	
	var strRoundTimeHours = strHours + strMinutes/60 + strSeconds / 3600;
	
	// Convert est. earnings to uBTC
	var strEarnings = elmEarnings.textContent;
	strEarnings = strEarnings.substr(0,strEarnings.length-4);
	strEarnings = strEarnings * 1000000;
	
	// Calculate round profitability as uBTC / hour
	var strRoundProfitability = strEarnings / strRoundTimeHours;
	
	// Format for display
	strEarnings = strEarnings.toFixed(0);
	strEarnings = strEarnings + " uBTC";
	strRoundProfitability = strRoundProfitability.toFixed(0);
	strRoundProfitability = strRoundProfitability + " uBTC/hr.";
	
	// Add round profitability value
	var elmRoundProfitability = document.createElement("td");
	elmRoundProfitability.appendChild(document.createTextNode(strRoundProfitability));
	elmEarnings.parentNode.insertBefore(elmRoundProfitability, elmEarnings.nextSibling);
	
	// Replace earnings value
	var elmNewEarnings = document.createElement("td");
	elmNewEarnings.appendChild(document.createTextNode(strEarnings));
	elmEarnings.parentNode.replaceChild(elmNewEarnings, elmEarnings);

}
