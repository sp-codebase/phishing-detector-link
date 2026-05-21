from deepfake_detector import analyze_uploaded_file

class FileLike:
    def read(self):
        with open("test.jpeg", "rb") as f:
            return f.read()

result = analyze_uploaded_file(FileLike())
print(result)
