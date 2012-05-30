all:
	git submodule init
	git submodule update
	uglifyjs rp.js > rp.min.js
	echo >> rp.min.js
