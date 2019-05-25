#!/usr/bin/env bash
# Script to execute a local CircleCI run.

# Check if docker is installed.
command -v docker >/dev/null 2>&1 || {
    echo >&2 "Docker is required to run circleci-cli! Aborting.";
    exit 1;
}

# Check if circleci-cli is installed.
command -v circleci >/dev/null 2>&1 || {
    echo >&2 "circleci-cli is required to execute local jobs! Aborting.";
    exit 1;
}

# Still here? Then generate a local config.
circleci config process .circleci/config.yml > .circleci/config.local.yml

if [[ ! -f .circleci/config.local.yml ]]; then
    echo >&2 "File not found!"
fi

# Everything OK? Then backup default (remote) CircleCI config...
mv .circleci/config.yml .circleci/config.remote.yml

# ...and "activate" the local config.
mv .circleci/config.local.yml .circleci/config.yml

# Now execute local job.
circleci local execute

# Restore default config.
mv .circleci/config.remote.yml .circleci/config.yml

echo "And we are done, hope every test succeeded ; )!"