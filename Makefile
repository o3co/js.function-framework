PKGDIRS := $(shell find ./packages -type f -d 2 -name "Makefile" -exec dirname {} \;)

.PHONY: install
install:
	lefthook install
	pnpm install

.PHONY: build
build:
	@for subdir in $(PKGDIRS); do \
		make -C $$subdir build;\
	done

