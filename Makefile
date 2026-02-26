#PKGDIRS := $(shell find ./packages -type f -mindepth 2 -maxdepth 2 -name "Makefile" -exec dirname "{}" \;)

.PHONY: install
install:
	lefthook install
	pnpm install


.PHONY: build
build: build/core build/all

.PHONY: build/core
build/core:
	make -C ./packages/core build


.PHONY: build/all
build/all: build/core build/lambda build/node
#	@for subdir in $(PKGDIRS); do \
#		make -C $$subdir build;\
#	done

build/%:
	make -C ./packages/$* build


.PHONY: format
format:
	@for subdir in $(PKGDIRS); do \
		$(MAKE) -C $$subdir format;\
	done
