STYLES = styles.css

all:

$(STYLES): styles.sass
	sass styles.sass styles.css

compile: $(STYLES)
