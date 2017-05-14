var rupture = require('rupture');
var nib = require('nib');
var stylus = require('gulp-stylus');
var flatten = require('gulp-flatten');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var notify = require("gulp-notify");
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

function swallowError(error) {
	// If you want details of the error in the console
	gutil.log(error.toString());
	gutil.beep();
	this.emit('end');
}

/**
 * OBS: seperate build tasks out so we can split the project into smaller pieces later.
 */

global.gulp.task('stylus', function(){
	var src = [
		global.srcFolder + "styles/**/*.styl",
		"!" + global.srcFolder + "styles/**/_cf*.styl"
	]
	var dst = global.srcFolder + "../build";

	var stream = global.gulp.src(src)
		.pipe(changed(dst, {
			extension: '.css'	
		}))
		.pipe(stylus({
			use: [nib(), rupture()],
			errors: true
		}))
		.pipe(global.gulp.dest(dst));
	
	return stream;
});

global.gulp.task('styles-build', ['stylus'], function(){
	var src = [
		global.srcFolder + "../build/**/*.css",
		global.srcFolder + "../build/cf/docs.css",
		global.srcFolder + "../build/cf/ui/section-cf-context.css",
		global.srcFolder + "../build/cf/ui/section-form.css",
		global.srcFolder + "../build/cf/ui/section-info.css",
		global.srcFolder + "../build/cf/ui/sticky-menu.css",
		global.srcFolder + "../build/cf/ui/switch.css",
		global.srcFolder + "../build/examples-boilerplate.css",
		
		"!" + global.srcFolder + "../build/**/cf-theming.css"
	]

	var dst = global.srcFolder + "../docs/styles";

	var stream = global.gulp.src(src)
		.pipe(concat('conversational-form-docs.css'))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(global.gulp.dest(dst));


	stream = global.gulp.src([global.srcFolder + "../build/**/cf-theming.css"])
		.pipe(concat('cf-theming.css'))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(global.gulp.dest(dst));
	
	return stream;
});