<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Result;
use Aws\Exception\AwsException;

class ObjectStorageInterface {
    private S3Client $client;
    private string $ENDPOINT;
    private string $bucket;

    public function __construct($bucket = "calendar"){
        $this->ENDPOINT = 'https://eu2.contabostorage.com/';
        $this->bucket = $bucket;

        $this->client = new S3Client([
            'endpoint' => $this->ENDPOINT,
            'profile' => 'default',
            'version' => 'latest',
            'region' => '',
            'use_path_style_endpoint' => true
        ]);
    }

    function upload_file_by_key($key, $file_path) : Result {
        return $this->client->putObject([
            'Bucket' => "{$this->bucket}",
            'Key' => "{$key}",
            'SourceFile' => $file_path
        ]);
    }

    function get_file_by_key($key) : Result {
        return $this->client->getObject([
            'Bucket' => "{$this->bucket}",
            'Key' => "{$key}"
        ]);
    }

    function get_image_url_by_key($key) : string {
        $cmd = $this->client->getCommand('GetObject', [
            'Bucket' => "{$this->bucket}",
            'Key' => "{$key}"
        ]);
        return $this->client->createPresignedRequest($cmd, '+10 minute')->getUri();
    }
}