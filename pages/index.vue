<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">
        <img src="/logo.png" alt="Logo">
      </div>
      <v-card>
        <v-card-title class="headline">Bienvenue dans l'application BdBox</v-card-title>
        <v-card-text>
          <p>BdBox vise à référencer de façon transparente les informations publiques relatives aux bases de données. </p>
          <div class="text-xs-right">
            <em><small>&mdash; Bruno Panaget</small></em>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat nuxt to="/bdtree">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
