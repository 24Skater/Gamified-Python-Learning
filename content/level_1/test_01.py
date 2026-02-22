import pytest


def test_variable_exists(user_code):
    """Check if the student defined the variable 'password'."""
    assert "password" in user_code.namespace, \
        "Glitch! The Guardian can't find a variable named 'password'. Did you check your spelling?"


def test_variable_value(user_code):
    """Check if the password value is correct."""
    expected = "CodeQuest2026"
    actual = user_code.namespace.get("password")

    assert actual == expected, \
        f"Access Denied! Your password was '{actual}', but the Guardian is looking for '{expected}'."


def test_is_string(user_code):
    """Ensure the student used a string, not an integer or other type."""
    actual = user_code.namespace.get("password")
    assert isinstance(actual, str), \
        "The Guardian is confused. Passwords must be text (strings), so make sure to use quote marks!"
