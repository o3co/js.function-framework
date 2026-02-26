PKGDIRS := $(shell find "./packages" -type f -mindepth 2 -maxdepth 2 -name "Makefile" -exec dirname "{}" \;)

.PHONY: install
install:
	lefthook install
	pnpm install

.PHONY: build
build:
	@for subdir in $(PKGDIRS); do \
		make -C $$subdir build;\
	done

.PHONY: format
format:
	@for subdir in $(PKGDIRS); do \
		$(MAKE) -C $$subdir format;\
	done
