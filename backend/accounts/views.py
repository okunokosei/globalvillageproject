from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserProfileSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_class = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user

class DeactivateAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request):
        user = request.user
        # user.is_active = False
        # user.save()
        user.delete()
        return Response({"detail": "アカウントを削除しました。"}, status=status.HTTP_204_NO_CONTENT)

