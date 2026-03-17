
import platform
import subprocess
import time
from abc import ABC

import ollama



class Controller():
    def __init__(self):
        super(Controller, self).__init__()
        self.ollama_process = None

    def is_running(self) -> bool:
        """
        Check if ollama is running
        """
        try:
            ollama.Client().list()
            return True
        except:
            return False

    async def start_ollama(self):
        """
        Start ollama
        """
        print("Starting ollama...")
        if platform.system() == "Windows":         
            self.ollama_process = subprocess.Popen(["ollama", "serve"], creationflags=subprocess.CREATE_NEW_CONSOLE)
        else:
            self.ollama_process = subprocess.Popen(["ollama", "serve"])


        max_await_time = 10
        start_time = time.time()
        while time.time() - start_time <= max_await_time:
            if self.is_running():
                break
            time.sleep(1)

        print("Ollama started!!!")

    async def stop_ollama(self):
        """
        Stop ollama
        """
        if self.ollama_process:
            print("Stopping ollama...")

            # Windows only for killing task
            if platform.system() == "Windows":
                try:
                    pid = self.ollama_process.pid
                    subprocess.run(["taskkill", "/F", "/PID", str(pid), "/T"], check=True, capture_output=True)
                except subprocess.CalledProcessError as e:
                    print(f"Failed to kill process tree with taskkill: {e.stderr.decode('utf-8', errors='ignore')}")
                except Exception as e:
                    print(f"An unexpected error occurred: {e}")
            else:
                self.ollama_process.terminate()
                try:
                    self.ollama_process.wait(timeout=5)
                except:
                    self.ollama_process.kill()

            self.ollama_process = None
            print("Ollama stopped!!!")