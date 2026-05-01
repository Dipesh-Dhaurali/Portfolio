import os
import smtplib
from email.message import EmailMessage

from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "message": "Flask contact API is running."})


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()

    if not all([name, email, subject, message]):
        return jsonify({"ok": False, "message": "Missing required fields."}), 400

    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASS")

    if not email_user or not email_pass:
        return jsonify(
            {"ok": False, "message": "Server email credentials are not configured."}
        ), 500

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Portfolio Contact: {subject}"
        msg["From"] = email_user
        msg["To"] = "dipesh1dip1@gmail.com"
        # So you can click Reply and answer the sender
        msg["Reply-To"] = email
        formatted = (
            f"Subject: {subject}\n\n"
            f"Dear Dipesh,\n"
            f"Hello Dipesh , My name is {name}. {message}\n\n"
            f"Thank you.\n"
            f"Name: {name}\n"
            f"Email: {email}\n"
        )
        msg.set_content(formatted)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(email_user, email_pass)
            smtp.send_message(msg)

        return jsonify({"ok": True, "message": "Email sent successfully."})
    except Exception as exc:
        print("SMTP error:", exc)
        return jsonify({"ok": False, "message": "Failed to send email."}), 500


@app.route("/", methods=["GET"])
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/project.html", methods=["GET"])
def project():
    return send_from_directory(BASE_DIR, "project.html")


@app.route("/images/<path:filename>", methods=["GET"])
def images(filename):
    return send_from_directory(os.path.join(BASE_DIR, "images"), filename)


@app.route("/<path:filename>", methods=["GET"])
def static_files(filename):
    if filename.startswith("api/"):
        abort(404)
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

