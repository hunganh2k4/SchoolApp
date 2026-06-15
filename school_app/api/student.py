import frappe

@frappe.whitelist(allow_guest=True)
def get_all_students():
    """Custom API to fetch all students"""
    students = frappe.get_all(
        "Student",
        fields=["name", "student_name", "student_email"]
    )
    return students
