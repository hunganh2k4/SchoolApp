import frappe
import unittest

class TestStudentAPI(unittest.TestCase):
    def setUp(self):
        # Setup run before each test
        # Clean up any students with our test email before testing
        frappe.db.delete("Student", {"student_email": ("like", "test_%@example.com")})
        frappe.db.commit()
        
    def tearDown(self):
        # Cleanup after each test
        frappe.db.delete("Student", {"student_email": ("like", "test_%@example.com")})
        frappe.db.commit()
        
    def test_create_and_get_student(self):
        from school_app.api.student import create_student, get_student
        
        # Test Create
        res = create_student("Test Student 1", "test_1@example.com")
        self.assertTrue("name" in res)
        self.assertEqual(res.get("message"), "Student created successfully")
        
        student_id = res.get("name")
        
        # Test Get
        student = get_student(student_id)
        self.assertEqual(student.get("student_name"), "Test Student 1")
        self.assertEqual(student.get("student_email"), "test_1@example.com")
        
    def test_update_student(self):
        from school_app.api.student import create_student, update_student, get_student
        
        res = create_student("Test Student 2", "test_2@example.com")
        student_id = res.get("name")
        
        # Test Update
        update_res = update_student(student_id, student_name="Updated Test Student 2")
        self.assertEqual(update_res.get("message"), "Student updated successfully")
        new_student_id = update_res.get("name")
        
        updated_student = get_student(new_student_id)
        self.assertEqual(updated_student.get("student_name"), "Updated Test Student 2")
        self.assertEqual(updated_student.get("student_email"), "test_2@example.com") # Email should remain unchanged
        
    def test_delete_student(self):
        from school_app.api.student import create_student, delete_student
        
        res = create_student("Test Student 3", "test_3@example.com")
        student_id = res.get("name")
        
        # Test Delete
        del_res = delete_student(student_id)
        self.assertEqual(del_res.get("message"), f"Student {student_id} deleted successfully")
        
        # Ensure it's deleted
        self.assertFalse(frappe.db.exists("Student", student_id))
        
    def test_get_all_students(self):
        from school_app.api.student import create_student, get_all_students
        
        create_student("Test Student 4", "test_4@example.com")
        create_student("Test Student 5", "test_5@example.com")
        
        students = get_all_students()
        
        # Should have at least the 2 students we just created
        self.assertGreaterEqual(len(students), 2)
        
        emails = [s.get("student_email") for s in students]
        self.assertIn("test_4@example.com", emails)
        self.assertIn("test_5@example.com", emails)
        
    def test_get_student_not_found(self):
        from school_app.api.student import get_student
        with self.assertRaises(frappe.DoesNotExistError):
            get_student("Non_Existent_Student_123")
            
    def test_create_student_missing_fields(self):
        from school_app.api.student import create_student
        with self.assertRaises(frappe.exceptions.ValidationError):
            # student_name is required
            create_student(None, "missing_name@example.com")
            
    def test_update_student_not_found(self):
        from school_app.api.student import update_student
        with self.assertRaises(frappe.DoesNotExistError):
            update_student("Non_Existent_Student_123", student_name="New Name")
            
    def test_delete_student_not_found(self):
        from school_app.api.student import delete_student
        with self.assertRaises(frappe.DoesNotExistError):
            delete_student("Non_Existent_Student_123")
