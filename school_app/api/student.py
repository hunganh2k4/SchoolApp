import frappe
import json

@frappe.whitelist(allow_guest=True)
def get_all_students():
    """Custom API to fetch all students"""
    students = frappe.get_all(
        "Student",
        fields=["name", "student_name", "student_email"]
    )
    return students

@frappe.whitelist(allow_guest=True)
def get_student(name):
    """Custom API to fetch a single student by name"""
    if not frappe.db.exists("Student", name):
        frappe.throw(f"Student {name} not found", frappe.DoesNotExistError)
    
    student = frappe.get_doc("Student", name)
    return {
        "name": student.name,
        "student_name": student.student_name,
        "student_email": student.student_email
    }

@frappe.whitelist(allow_guest=True)
def create_student(student_name, student_email):
    """Custom API to create a new student"""
    student = frappe.get_doc({
        "doctype": "Student",
        "student_name": student_name,
        "student_email": student_email
    })
    student.insert(ignore_permissions=True)
    return {
        "message": "Student created successfully",
        "name": student.name
    }

@frappe.whitelist(allow_guest=True)
def update_student(name, student_name=None, student_email=None):
    """Custom API to update an existing student"""
    if not frappe.db.exists("Student", name):
        frappe.throw(f"Student {name} not found", frappe.DoesNotExistError)
        
    student = frappe.get_doc("Student", name)
    
    if student_name:
        student.student_name = student_name
    if student_email:
        student.student_email = student_email
        
    student.save(ignore_permissions=True)
    return {
        "message": "Student updated successfully",
        "name": student.name
    }

@frappe.whitelist(allow_guest=True)
def delete_student(name):
    """Custom API to delete a student"""
    if not frappe.db.exists("Student", name):
        frappe.throw(f"Student {name} not found", frappe.DoesNotExistError)
        
    frappe.delete_doc("Student", name, ignore_permissions=True)
    return {
        "message": f"Student {name} deleted successfully"
    }
