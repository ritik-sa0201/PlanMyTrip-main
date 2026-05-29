from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)


def create_trip_pdf(
        itinerary,
        filepath
):

    doc = SimpleDocTemplate(
        filepath
    )

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            itinerary["summary"],
            styles["Title"]
        )
    )

    content.append(
        Spacer(1, 12)
    )

    for day in itinerary["days"]:

        content.append(
            Paragraph(
                f"Day {day['day']}",
                styles["Heading2"]
            )
        )

        for activity in day["activities"]:

            content.append(
                Paragraph(
                    f"""
                    {activity['place']}
                    -
                    {activity['description']}
                    """,
                    styles["BodyText"]
                )
            )

        content.append(
            Spacer(1, 10)
        )

    doc.build(content)