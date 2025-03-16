#include <stdio.h>

int add(int left, int right) {
  printf("Adding %d and %d\n", left, right);
  return left + right;
}

int subtract(int left, int right) {
  printf("Subtracting %d from %d\n", right, left);
  return left - right;
}

int multiply(int left, int right) {
  printf("Multiplying %d and %d\n", left, right);
  return left * right;
}

int divide(int left, int right) {
  if (right == 0) {
    printf("Error: Division by zero\n");
    return 0;
  }
  printf("Dividing %d by %d\n", left, right);
  return left / right;
}

int modulo(int left, int right) {
  if (right == 0) {
    printf("Error: Modulo by zero\n");
    return 0;
  }
  printf("Computing %d modulo %d\n", left, right);
  return left % right;
}
