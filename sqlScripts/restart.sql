SELECT *, pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
AND datname = :datnameQ;

REVOKE CONNECT ON DATABASE :datname FROM public;

DROP DATABASE :datname;

CREATE DATABASE :datname OWNER=:username;