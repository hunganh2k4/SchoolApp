import frappe

def execute():
    if not frappe.db.exists("Student", "John Doe"):
        doc = frappe.get_doc({
            "doctype": "Student",
            "student_name": "John Doe",
            "student_email": "john.doe@example.com"
        })
        doc.insert()
