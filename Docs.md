<p align="center">
  <a href="#Modelos">Models</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#User">User</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#Session">Session</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#Address">Address</a>
</p>

# Modelos

## User - rota /user
 email -> tipo string e obrigatorio (Tem validação especial para email) <br/>
 name -> tipo string e obrigatorio  <br/>
 telephone -> tipo string e obrigatorio  <br/>
 password -> tipo string, obrigatorio e tem que ter no minimo 5 caracteres  <br/>
 birthdate -> tipo data e obrigatorio  <br/>
 weight -> tipo number e obrigatorio  <br/>
 ethnicity -> obrigatorio e é um enum de (branco, pardo, negro, amarelo, indigena, outro) <br/>

## Session - rota /signin
 email -> tipo string e obrigatorio (Tem validação especial para email) <br/>
 password -> tipo string, obrigatorio e tem que ter no minimo 5 caracteres  <br/>

## Address - rota /address
  street -> tipo string e obrigatorio <br/>
  district -> tipo string e obrigatorio <br/>
  number -> tipo number e obrigatorio  <br/>
  complement -> tipo string e não é obrigatorio <br/>
  cep -> tipo string e obrigatorio <br/>
  city -> tipo string e obrigatorio <br/>
  state -> tipo string e obrigatorio <br/>

#### A relação que foi utilizada nas tabelas(User, Address) foi um para muitos

<br/>

# User

## Mudanças
<p>
   No modelo estava pedindo para salvar a idade do usuario, entretanto não é uma boa pratica
   fazer isso! então mudei para data de aniversario/nascimento
</p>

## Rotas

### Metodo Post - /user
### Metodo Get - /user/:id
### Metodo Put - /user/:id
### Metodo Delete - /user/:id

<br/>

#### Obs.: todos tem validação

<br/>

# Session

## Rotas

### Metodo Post - /signin

<br/>

#### Obs.: todos tem validação e essa rota retorna um jwt token

<br/>

# Address

## Mudanças
<p>
   No modelo estava pedindo para campo endereço, entretanto divide esse campo em dois
   Rua e Bairro!
</p>

## Rotas - acesso por token

### Metodo Post - /address
### Metodo Get - /address/:id
### Metodo Put - /address/:id
### Metodo Delete - /address/:id

<br/>

#### Obs.: todos tem validação e para ter acesso as rotas é necessario um token

<br/>

