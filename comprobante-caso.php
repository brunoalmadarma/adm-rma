<?php
// Conserva los enlaces relativos antiguos y usa el comprobante de la raíz.
$query = http_build_query(['token' => (string) ($_GET['token'] ?? '')]);
header('Location: /rma-app/comprobante-caso.php?' . $query, true, 302);
exit;
