-- drop table if exists links;
create table if not exists links(
  short text primary key,
  long text not null,
  created_at timestamp with time zone default localtimestamp not null,
  last_visited_at timestamp with time zone default null,
  visits integer default 0 not null
);

