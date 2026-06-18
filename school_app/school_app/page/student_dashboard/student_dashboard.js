frappe.pages['student-dashboard'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Student Dashboard',
        single_column: true
    });

    // Add a primary button to the page header for creating a new student
    page.set_primary_action('New Student', () => {
        show_student_dialog();
    }, 'add');

    $(page.body).html(`
        <div style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
            <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                <button id="load" class="btn btn-default">Refresh List</button>
            </div>
            <div id="result" style="width: 100%; max-width: 600px;"></div>
        </div>
    `);

    // Function to load all students
    const load_students = () => {
        $("#result").html('<p style="text-align: center; color: var(--text-muted);">Loading...</p>');
        frappe.call({
            method: "school_app.api.student.get_all_students",
            callback: function (r) {
                let students = r.message || [];
                if (students.length === 0) {
                    $("#result").html('<p style="text-align: center; color: var(--text-muted);">No students found.</p>');
                    return;
                }
                let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
                students.forEach(s => {
                    html += `
                        <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                            <div>
                                <div style="font-weight: 600; font-size: 15px;">${s.student_name}</div>
                                <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">${s.student_email || ''}</div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-default btn-sm edit-btn" data-name="${s.name}" data-student_name="${s.student_name}" data-student_email="${s.student_email}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-name="${s.name}">Delete</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                $("#result").html(html);

                // Attach event listeners to newly created buttons
                $('.edit-btn').click(function () {
                    let name = $(this).data('name');
                    let student_name = $(this).data('student_name');
                    let student_email = $(this).data('student_email');
                    show_student_dialog({ name, student_name, student_email });
                });

                $('.delete-btn').click(function () {
                    let name = $(this).data('name');
                    frappe.confirm('Are you sure you want to delete this student?', () => {
                        delete_student(name);
                    });
                });
            }
        });
    };

    // Dialog for Creating or Editing a Student
    const show_student_dialog = (student = null) => {
        let is_edit = !!student;
        let dialog = new frappe.ui.Dialog({
            title: is_edit ? 'Edit Student' : 'New Student',
            fields: [
                {
                    label: 'Student Name',
                    fieldname: 'student_name',
                    fieldtype: 'Data',
                    reqd: 1,
                    default: is_edit ? student.student_name : ''
                },
                {
                    label: 'Student Email',
                    fieldname: 'student_email',
                    fieldtype: 'Data',
                    reqd: 1,
                    default: is_edit ? student.student_email : ''
                }
            ],
            primary_action_label: is_edit ? 'Update' : 'Create',
            primary_action(values) {
                if (is_edit) {
                    frappe.call({
                        method: "school_app.api.student.update_student",
                        args: {
                            name: student.name,
                            student_name: values.student_name,
                            student_email: values.student_email
                        },
                        callback: function (r) {
                            if (!r.exc) {
                                frappe.show_alert({ message: 'Student updated successfully', indicator: 'green' });
                                dialog.hide();
                                load_students();
                            }
                        }
                    });
                } else {
                    frappe.call({
                        method: "school_app.api.student.create_student",
                        args: {
                            student_name: values.student_name,
                            student_email: values.student_email
                        },
                        callback: function (r) {
                            if (!r.exc) {
                                frappe.show_alert({ message: 'Student created successfully', indicator: 'green' });
                                dialog.hide();
                                load_students();
                            }
                        }
                    });
                }
            }
        });
        dialog.show();
    };

    // Delete functionality
    const delete_student = (name) => {
        frappe.call({
            method: "school_app.api.student.delete_student",
            args: {
                name: name
            },
            callback: function (r) {
                if (!r.exc) {
                    frappe.show_alert({ message: 'Student deleted successfully', indicator: 'green' });
                    load_students();
                }
            }
        });
    };

    // Load initial data and bind refresh button
    $("#load").click(load_students);
    load_students(); // Auto load on page start
};
