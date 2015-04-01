STYLES = styles.css
SCRIPTS = mathedit.min.js

all:

$(STYLES): styles.sass
	sass styles.sass styles.css

$(SCRIPTS): mathedit.js
	yui-compressor --type js mathedit.js -o mathedit.min.js

compile: $(STYLES) $(SCRIPTS)
