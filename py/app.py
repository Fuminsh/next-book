import os 
import platform
import math

a = int(input("Valor Coeficiente A: "))
b = int(input("Valor Coeficiente B: "))
c = int(input("Valor Coeficiente C: "))

def clear_console():
    if platform.system() == 'Windows':
        os.system('cls')
    else:
        os.system('clear')
def exit_code():
    exit()

clear_console()

a_sign = "+" if a > 0 else ""
b_sign = "+" if b > 0 else ""
c_sign = "+" if c > 0 else ""

print(f"f(x)= {a_sign}{a}x² {b_sign}{b}x {c_sign}{c}")

delta = b * b - 4*a*c
delta_sig = "+" if delta > 0 else ""

print(f"∆ = {b}² - 4.{a}.{c}")
print(f"∆ = {delta_sig}{delta}")

if delta <= 0:
    print("Delta <= 0 encerrando...")
    exit_code()
else:
    print(f"Delta > 0 continuando...")
if b > 0:
    b = b * -1
else:
    b = b * 1

print(f"x¹·² = {b} ± √{delta}/2.{a}")

x1 = (b + math.sqrt(delta)/ (2*a))
x2 = (b - math.sqrt(delta)/ (2*a))

print(f"x¹ = {x1:.2f} e x² = {x2:.2f}")

xv = b / 2*a
yvdelta = delta * -1
yv = yvdelta / 4*a

print(f"Xv = {b}/2.{a} e Yv = {yvdelta}/4.{a}")
print(f"Xv = {xv} e Yv = {yv}")

exit_code()