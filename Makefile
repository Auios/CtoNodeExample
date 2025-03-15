# Detect platform
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
	LIB_PREFIX = lib
	LIB_EXT = .so
	COMPILE_FLAGS = -dynamiclib
else ifeq ($(UNAME_S),Linux)
	LIB_PREFIX = lib
	LIB_EXT = .so
	COMPILE_FLAGS = -shared -fPIC
else
	LIB_PREFIX =
	LIB_EXT = .dll
	COMPILE_FLAGS = -shared
endif

# Library name
LIB_NAME = math

TARGET = $(LIB_PREFIX)$(LIB_NAME)$(LIB_EXT)

.PHONY: all
all: clean $(TARGET)

$(TARGET): native/math.c
	mkdir -p build
	gcc $(COMPILE_FLAGS) -o build/$(TARGET) native/math.c

.PHONY: clean
clean:
	rm -rf build/

