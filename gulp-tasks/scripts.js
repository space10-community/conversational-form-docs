var typescript = require('gulp-typescript');
var flatten = require('gulp-flatten');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var notify = require("gulp-notify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

function swallowError(error) {
	// If you want details of the error in the console
	gutil.log(error.toString());
	gutil.beep();
	this.emit('end');
}

global.gulp.task('typescript', function() {
	var src = [
		global.srcFolder + "../src/scripts/**/*.ts",
		"!" + global.srcFolder + "../src/scripts/typings/**/*.d.ts"
		];
	var dst = global.buildFolder + "../build";

	var stream = global.gulp.src(src)
		.pipe(changed(dst,{
			extension: '.js'
		}))
		.pipe(typescript({
			noImplicitAny: true,
			target: "ES5",
			module: "none"//AMD... etc.
		}))
		.on('error', swallowError)
		.pipe(global.gulp.dest(dst))
		.pipe(livereload())
		.pipe(notify("Typescript compiled."));

	return stream
});

global.gulp.task('scripts-build', ['scripts-build-docs', 'scripts-build-examples'], function(){
});

global.gulp.task('scripts-build-docs', ['typescript'], function(){
	// build order is important in a inheritance world
	var src = [
		global.buildFolder + "cf/ConversationalFormDocs.js"
	];
	var dst = global.srcFolder + "../docs/scripts";

	var stream = global.gulp.src(src)
		.pipe(concat('conversational-form-docs.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(global.gulp.dest(dst));

	return stream;
});

global.gulp.task('scripts-build-examples', ['typescript'], function(){
	// build order is important in a inheritance world
	var src = [
		global.buildFolder + "cf/ConversationalFormExamples.js"
	];
	var dst = global.srcFolder + "../docs/scripts";

	var stream = global.gulp.src(src)
		.pipe(concat('conversational-form-examples.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(global.gulp.dest(dst));

	return stream;
});