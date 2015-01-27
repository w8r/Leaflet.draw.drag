SOURCES  = dist/L.Control.LineStringSelect.js dist/L.Control.LineStringSelect.no-rbush.js
COMPILED = dist/L.Control.LineStringSelect.min.js dist/L.Control.LineStringSelect.no-rbush.min.js
QS       = compilation_level=ADVANCED_OPTIMIZATIONS&output_format=text
URL      = http://closure-compiler.appspot.com/compile

all: clean sources compile

clean:
	@rm -rf dist/*

dist/L.Control.LineStringSelect.js:
	@browserify -s L.Control.LineStringSelect -u leaflet index.js -o dist/L.Control.LineStringSelect.js;

dist/L.Control.LineStringSelect.no-rbush.js:
	@browserify -s L.Control.LineStringSelect -u leaflet -u rbush index.js -o dist/L.Control.LineStringSelect.no-rbush.js;

sources: ${SOURCES}

compile: ${COMPILED}

%.min.js: %.js
	@echo " - $(<) -> $(@)";
	@curl --silent --show-error --data-urlencode "js_code@$(<)" --data-urlencode "js_externs@src/externs.js" \
	 --data "${QS}&output_info=compiled_code" ${URL} -o $(@)
