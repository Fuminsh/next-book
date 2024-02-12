<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (isset($_POST["valor"]) && isset($_POST["nome"]) && isset($_POST["email"])) {

        $valor = $_POST["valor"];
        $nome = $_POST["nome"];
        $email = $_POST["email"];


        $dados_doacao = "Valor da doação: " . $valor . "\n";
        $dados_doacao .= "Nome: " . $nome . "\n";
        $dados_doacao .= "E-mail: " . $email . "\n";
        $dados_doacao .= "Data: " . date("Y-m-d H:i:s") . "\n\n";

        $arquivo = fopen("../donate-txt/doacoes.txt", "a");

        fwrite($arquivo, $dados_doacao);
        fclose($arquivo);

        echo "../html/after-donate-nb.html";
    } else {
        echo "Erro: Todos os campos são obrigatórios!";
    }
}
?>
