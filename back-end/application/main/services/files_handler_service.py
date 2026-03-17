from fastapi import Form, UploadFile, File


class FilesHandlerService(object):
    def __init__(self):
        pass

    async def similarity_cal(
        sen1: str = Form(...),
        file: File = UploadFile(...),
        model: str = Form(...)
    ):
        pass

service = FilesHandlerService()