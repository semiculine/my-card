from django.http import JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def card_detail(request):
    return JsonResponse(
        {
            "name": "Colin Esperanza",
            "major": "Computer Science & Engineering",
            "ability": "Inability to decide between more than one option.",
            "stats": [
                {"name": "Athleticism", "value": 75},
                {"name": "Snack Power", "value": 78},
                {"name": "Fashion Power", "value": 88},
            ],
            "funFacts": [
                "My favorite way to reset is a coffee, a playlist, and a completely unnecessary choice of snack.",
                "Still, I somehow always pick the same one.",
            ],
        }
    )
