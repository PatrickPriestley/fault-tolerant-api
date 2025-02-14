import time
from functools import wraps

class CircuitBreaker:
    def __init__(self, failure_threshold=3, reset_timeout=60):
        self.failure_threshold = failure_threshold  # Failures before tripping
        self.reset_timeout = reset_timeout  # Cooldown period
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # Initial state

    def allow_request(self):
        """Determine if requests should be allowed."""
        if self.state == "OPEN":
            if time.time() - self.last_failure_time >= self.reset_timeout:
                self.state = "HALF-OPEN"
                return True  # Allow test requests
            return False
        return True

    def record_failure(self):
        """Track failures and trip the breaker if needed."""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            print("Circuit Breaker TRIPPED! Blocking requests.")

    def reset(self):
        """Reset breaker after successful responses."""
        self.failure_count = 0
        self.state = "CLOSED"

    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not self.allow_request():
                raise Exception("Circuit Breaker Open - Request Blocked")

            try:
                response = func(*args, **kwargs)
                self.reset()  # Reset on success
                return response
            except Exception as e:
                self.record_failure()
                raise e

        return wrapper
