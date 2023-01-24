-- Seed data with a fake user for testing

insert into users (name, email, entries, joined) values ('a', 'a', 5, '2018-01-01');
insert into login (hash, email) values ('$2a$10$6Qi.g2ii1U1gtWw0Q.MNV.5taDu/LL8tWaexCEK3z09kScTKQuOpq', 'a');


