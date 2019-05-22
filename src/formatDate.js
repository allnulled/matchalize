module.exports = function(date, format) {
	if (!format) format = "yyyy-MM-dd-HH-mm-ss";

	var month = date.getMonth() + 1;
	var year = date.getFullYear();

	format = format.replace("MM", month.toString().padStart(2, "0"));

	if (format.indexOf("yyyy") > -1) format = format.replace("yyyy", year.toString());
	else if (format.indexOf("yy") > -1) format = format.replace("yy", year.toString().substr(2, 2));

	format = format.replace(
		"dd",
		date
			.getDate()
			.toString()
			.padStart(2, "0")
	);

	var hours = date.getHours();
	if (format.indexOf("t") > -1) {
		if (hours > 11) format = format.replace("t", "pm");
		else format = format.replace("t", "am");
	}
	if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().padStart(2, "0"));
	if (format.indexOf("hh") > -1) {
		if (hours > 12) hours - 12;
		if (hours == 0) hours = 12;
		format = format.replace("hh", hours.toString().padStart(2, "0"));
	}
	if (format.indexOf("mm") > -1)
		format = format.replace(
			"mm",
			date
				.getMinutes()
				.toString()
				.padStart(2, "0")
		);
	if (format.indexOf("ss") > -1)
		format = format.replace(
			"ss",
			date
				.getSeconds()
				.toString()
				.padStart(2, "0")
		);
	return format;
};
