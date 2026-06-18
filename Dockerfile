# Use the official Frappe worker image as base
ARG FRAPPE_VERSION=v16
FROM frappe/frappe-worker:${FRAPPE_VERSION}

# Switch to root to install dependencies if any
USER root
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Switch back to frappe user
USER frappe

# Install the custom app
RUN bench get-app school_app https://github.com/your-username/school_app.git --branch main

# To use local source code instead of git (for CI/CD build):
# COPY . /home/frappe/frappe-bench/apps/school_app
# RUN bench install-app school_app
