from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
# from rest_framework.exceptions import PermissionDDenied
from .models import Events, EventParticipant
from .serializers import EventSerializer, ParticipantListSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

# Create your views here.
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Events.objects.all().order_by('date', 'start_time')
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class MyJoinedEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Events.objects.filter(participants=self.request.user).order_by('date')

class EventParticipantListView(generics.ListAPIView):
    serializer_class = ParticipantListSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return EventParticipant.objects.filter(event_id=event_id)

class EventJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, event_id):
        event = get_object_or_404(Events, id=event_id)
        participation, created = EventParticipant.objects.get_or_create(
            event=event,
            user=request.user
        )
        if created:
            return Response({"detail": "参加登録しました。"}, status=status.HTTP_201_CREATED)
        else:
            participation.delete()
            return Response({"detail": "参加をキャンセルしました。"}, status=status.HTTP_200_OK)
