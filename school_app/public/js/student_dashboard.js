frappe.pages['student-dashboard'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Student Dashboard ABC',
        single_column: true
    });

    $(page.body).html(`
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
            <h3 style="margin-bottom: 20px;">Student Dashboard</h3>
            <button id="load" class="btn btn-primary" style="margin-bottom: 30px;">Load Student</button>
            <div id="result" style="text-align: center; width: 100%; max-width: 600px;"></div>
        </div>
    `);

    $("#load").click(() => {
        frappe.call({
            method: "school_app.api.student.get_all_students",
            callback: function (r) {
                let students = r.message || [];
                if (students.length === 0) {
                    $("#result").html('<p style="color: var(--text-muted);">No students found.</p>');
                    return;
                }
                let html = '<div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">';
                students.forEach(s => {
                    html += `
                        <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 15px 25px; width: 100%; max-width: 500px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                            <div style="font-weight: 600; font-size: 15px;">${s.student_name}</div>
                            <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">${s.student_email || ''}</div>
                        </div>
                    `;
                });
                html += '</div>';
                $("#result").html(html);
            }
        });
    });
};
