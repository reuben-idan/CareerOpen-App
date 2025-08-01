from rest_framework import permissions

class IsJobOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a job to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the job.
        return obj.poster == request.user


class IsApplicationOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a job application to view or edit it.
    Also allows the job poster to view applications for their job postings.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to the applicant or the job poster
        if request.method in permissions.SAFE_METHODS:
            return obj.applicant == request.user or obj.job.poster == request.user

        # Write permissions are only allowed to the applicant or the job poster
        if request.method in ['PATCH', 'PUT']:
            # Only allow updating status if the user is the job poster
            if 'status' in request.data and len(request.data) == 1:
                return obj.job.poster == request.user
            # Only allow the applicant to update their application
            return obj.applicant == request.user

        # Delete permissions are only allowed to the applicant or the job poster
        return obj.applicant == request.user or obj.job.poster == request.user


class IsJobPosterOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow the poster of a job to view applications.
    """
    def has_permission(self, request, view):
        # Allow read permissions for list views
        if request.method in permissions.SAFE_METHODS:
            return True
        return True

    def has_object_permission(self, request, view, obj):
        # Allow read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Only allow the job poster to modify the job
        return obj.poster == request.user
