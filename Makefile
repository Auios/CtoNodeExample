# Set default compiler
CC = gcc

# Check if we're building WebAssembly
ifeq ($(MAKECMDGOALS),wasm)
	# WebAssembly specific settings
	LIB_PREFIX = 
	LIB_EXT = .wasm
	COMPILE_FLAGS = -s SIDE_MODULE=2 -s EXPORTED_FUNCTIONS='["_add", "_subtract", "_multiply", "_divide", "_modulo"]'
	CC = emcc
else
	# Detect platform for native builds
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
endif

# Library name
LIB_NAME = math

TARGET = $(LIB_PREFIX)$(LIB_NAME)$(LIB_EXT)

.PHONY: all
all: clean $(TARGET)

$(TARGET): native/math.c
	mkdir -p build
	$(CC) $(COMPILE_FLAGS) -o build/$(TARGET) native/math.c

.PHONY: wasm
wasm: clean
	mkdir -p build
	$(CC) $(COMPILE_FLAGS) -o build/math.wasm native/math.c

.PHONY: clean
clean:
	rm -rf build/