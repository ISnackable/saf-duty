CREATE TYPE "public"."role" AS ENUM('user', 'manager', 'admin');

ALTER TYPE "public"."role" OWNER TO "postgres";

CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'declined');

ALTER TYPE "public"."status" OWNER TO "postgres";

CREATE TYPE "public"."action" AS ENUM('swap_requests');

ALTER TYPE "public"."action" OWNER TO "postgres";