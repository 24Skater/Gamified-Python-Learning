import pytest


def test_print_called(user_code):
    """Check if the student produced any output."""
    assert user_code.stdout.strip(), \
        "Glitch! The beacon is still dark. Did you use print() to send a signal?"


def test_correct_message(user_code):
    """Check if the output contains the exact beacon signal."""
    expected = "SOS from Codexia!"
    assert expected in user_code.stdout, \
        f"Signal garbled! The beacon received '{user_code.stdout.strip()}', but it needs exactly '{expected}'."


def test_uses_print(user_code):
    """Check if the student actually used print() in their code."""
    assert "print" in user_code.source, \
        "The beacon needs the print() spell to broadcast. Try using print() in your code!"
