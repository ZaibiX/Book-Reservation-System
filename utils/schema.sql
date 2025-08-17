
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.author (
  name character varying NOT NULL UNIQUE,
  id integer NOT NULL DEFAULT nextval('author_id_seq'::regclass),
  CONSTRAINT author_pkey PRIMARY KEY (id)
);
CREATE TABLE public.book (
  isbn character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  genre_id integer,
  id integer NOT NULL DEFAULT nextval('book_id_seq'::regclass),
  CONSTRAINT book_pkey PRIMARY KEY (id),
  CONSTRAINT book_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre(id)
);
CREATE TABLE public.bookauthor (
  book_id integer NOT NULL,
  author_id integer NOT NULL,
  CONSTRAINT bookauthor_pkey PRIMARY KEY (book_id, author_id),
  CONSTRAINT bookauthor_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id),
  CONSTRAINT bookauthor_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id)
);
CREATE TABLE public.bookcopy (
  book_id integer NOT NULL,
  is_reserved boolean DEFAULT false,
  id integer NOT NULL DEFAULT nextval('bookcopy_id_seq'::regclass),
  CONSTRAINT bookcopy_pkey PRIMARY KEY (id),
  CONSTRAINT bookcopy_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id)
);
CREATE TABLE public.fine (
  reservation_id integer UNIQUE,
  amount numeric DEFAULT 0 CHECK (amount >= 0::numeric),
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id integer NOT NULL DEFAULT nextval('fine_id_seq'::regclass),
  CONSTRAINT fine_pkey PRIMARY KEY (id),
  CONSTRAINT fine_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservation(id)
);
CREATE TABLE public.genre (
  title character varying NOT NULL UNIQUE,
  id integer NOT NULL DEFAULT nextval('genre_id_seq'::regclass),
  CONSTRAINT genre_pkey PRIMARY KEY (id)
);
CREATE TABLE public.librarian (
  name_id integer NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  id integer NOT NULL DEFAULT nextval('librarian_id_seq'::regclass),
  CONSTRAINT librarian_pkey PRIMARY KEY (id),
  CONSTRAINT librarian_name_id_fkey FOREIGN KEY (name_id) REFERENCES public.name(id)
);
CREATE TABLE public.name (
  fname character varying,
  lname character varying,
  id integer NOT NULL DEFAULT nextval('name_id_seq'::regclass),
  CONSTRAINT name_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reservation (
  student_id integer,
  book_copy_id integer,
  id integer NOT NULL DEFAULT nextval('reservation_id_seq'::regclass),
  due_date timestamp without time zone NOT NULL,
  status_id integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reservation_pkey PRIMARY KEY (id),
  CONSTRAINT reservation_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.reservation_status(id),
  CONSTRAINT reservation_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id),
  CONSTRAINT reservation_book_copy_id_fkey FOREIGN KEY (book_copy_id) REFERENCES public.bookcopy(id)
);
CREATE TABLE public.reservation_status (
  title character varying NOT NULL UNIQUE,
  id integer NOT NULL DEFAULT nextval('reservation_status_id_seq'::regclass),
  CONSTRAINT reservation_status_pkey PRIMARY KEY (id)
);
CREATE TABLE public.student (
  name_id integer,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  id integer NOT NULL DEFAULT nextval('student_id_seq'::regclass),
  CONSTRAINT student_pkey PRIMARY KEY (id),
  CONSTRAINT student_name_id_fkey FOREIGN KEY (name_id) REFERENCES public.name(id)
);