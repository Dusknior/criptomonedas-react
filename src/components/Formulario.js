import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import Axios from "axios";
import Error from "./Error";
import PropTypes from "prop-types";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
  //  State del listado de criptomonedas
  const [listacripto, guardarCriptomonedas] = useState([]);

  // Validacione
  const [error, guardarError] = useState(false);

  const Monedas = [
    {
      codigo: "USD",
      nombre: "Dolar de Estados Unidos",
    },
    {
      codigo: "COP",
      nombre: "Peso Colombiano",
    },
    {
      codigo: "EUR",
      nombre: "Euro",
    },
    {
      codigo: "GBP",
      nombre: "Libra Esterlina",
    },
  ];

  // Utilizar useMoneda
  const [moneda, SelectMonedas] = useMoneda("Elige tu Moneda", "", Monedas);

  // Utilizar useCriptomoneda
  const [criptomoneda, SelectCriptos] = useCriptomoneda(
    "Elige tu Criptomoneda",
    "",
    listacripto
  );

  // Ejecutar llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

      const resultado = await Axios.get(url);

      guardarCriptomonedas(resultado.data.Data);
    };
    consultarAPI();
  }, []);

  // Cuando el usuario unde submit
  const cotizarMoneda = (e) => {
    e.preventDefault();

    // Validar si ambos cambos están llenos
    if (moneda === "" || criptomoneda === "") {
      guardarError(true);
      return;
    }

    // Pasar los datos al componente principal
    guardarError(false);
    guardarMoneda(moneda);
    guardarCriptomoneda(criptomoneda);
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />
      <SelectCriptos />
      <Boton type="submit" value="Calcular"></Boton>
    </form>
  );
};

Formulario.propTypes = {
  guardarMoneda: PropTypes.func.isRequired,
  guardarCriptomoneda: PropTypes.func.isRequired,
};

export default Formulario;
